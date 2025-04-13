import { Formik, Field, Form, FormikHelpers } from "formik";

interface FormValues {
  login: {
    email: string;
    password: string;
  };
  register: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  };
  forgotPassword: {
    email: string;
  };
}

interface Props {
  formType: "login" | "register" | "forgotPassword";
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

const inputStyles = "border-2 border-gray-300 rounded-md p-2 w-full";

const FormTemplate = ({ formType, onSubmit }: Props) => {
  return (
    <Formik
      initialValues={{
        login: {
          email: "",
          password: "",
        },
        register: {
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
        },
        forgotPassword: {
          email: "",
        },
      }}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="flex flex-col space-y-4 w-[100%] md:w-[60%] mx-auto">
          {formType === "login" && (
            <>
              <Field
                name="login.email"
                type="email"
                placeholder="Email"
                className={inputStyles}
                required
              />
              <Field
                name="login.password"
                type="password"
                placeholder="Password"
                className={inputStyles}
                required
              />
            </>
          )}
          {formType === "register" && (
            <>
              <Field
                name="register.email"
                type="email"
                placeholder="Email"
                className={inputStyles}
                required
              />
              <Field
                name="register.password"
                type="password"
                placeholder="Password"
                className={inputStyles}
                required
              />
              <Field
                name="register.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className={inputStyles}
                required
              />
              <Field
                name="register.name"
                type="text"
                placeholder="Name"
                className={inputStyles}
                required
              />
            </>
          )}
          {formType === "forgotPassword" && (
            <>
              <Field
                name="forgotPassword.email"
                type="email"
                placeholder="Email"
                className={inputStyles}
                required
              />
            </>
          )}
          <button
            type="submit"
            className="bg-black text-white p-2 rounded-md hover:bg-gray-900"
            aria-label="Submit form"
          >
            {formType === "login"
              ? "Sign In"
              : formType === "register"
              ? "Sign Up"
              : "Reset Password"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormTemplate;
