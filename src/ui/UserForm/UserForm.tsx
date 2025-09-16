import { useMutation } from "@apollo/client/react";
import { jwtDecode } from "jwt-decode";
import { useEffect, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ServerMapping } from "../../consts";
import { USER_LOGIN } from "../../mutations/userLogin";
import FormField from "../FormField/FormField";
import Spinner from "../Spinner/Spinner";
import styles from "./UserForm.module.scss";

type InputLogin = {
  email: String;
  password: String;
};

type ResponceData = {
  login: { jwt: string };
};

type ErrorResponce = {
  errors: Array<{ message: string }>;
};

const showErrorMessages = (arr?: Array<{ message: string }>) =>
  arr && arr.forEach((item) => toast.error(ServerMapping[item.message]));

export const UserForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputLogin>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [userLogin, { data, loading, error }] =
    useMutation<ResponceData>(USER_LOGIN);

  const onSubmit: SubmitHandler<InputLogin> = (formData) => {
    userLogin({ variables: formData });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const typedError = error as unknown as ErrorResponce;
    if (typedError?.errors) {
      showErrorMessages(typedError?.errors);
    }
  }, [error]);

  useEffect(() => {
    if (data && data.login) {
      localStorage.setItem("token", data.login.jwt);
      const { id } = jwtDecode<{ id: Number }>(data.login.jwt);
      navigate("/", { state: { id } });
    }
  }, [data]);

  return loading ? (
    <Spinner />
  ) : (
    <form
      className={styles.form}
      name="loginForm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField<InputLogin>
        register={register("email", {
          required: "Field is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "invalid email address",
          },
        })}
        name="email"
        data-cy="email"
        errors={errors}
      />
      <FormField<InputLogin>
        register={register("password", {
          required: "Field is required",
        })}
        name="password"
        type="password"
        data-cy="password"
        errors={errors}
      />
      <button type="submit" data-cy="submit">
        Login
      </button>
    </form>
  );
};
