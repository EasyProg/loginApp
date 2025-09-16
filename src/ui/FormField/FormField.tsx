import { ErrorMessage } from "@hookform/error-message";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";
import styles from "./FormField.module.scss";

interface FormField<TFieldValues extends FieldValues>
  extends React.ComponentPropsWithoutRef<"input"> {
  register: UseFormRegisterReturn;
  name: Path<TFieldValues>;
  errors: FieldErrors;
}

const FormField = <TFieldValues extends FieldValues>({
  register,
  errors,
  name,
  ...props
}: FormField<TFieldValues>) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.formField}>
        <label htmlFor={name}>{name}</label>
        <input {...register} {...props} className={styles.formInput} />
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className={styles.errorBlock}>{message}</p>}
      />
    </div>
  );
};

export default FormField;
