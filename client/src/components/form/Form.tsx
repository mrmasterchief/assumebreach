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
  forgotPassword2: {
    securityQuestion: string;
    newPassword: string;
  };
}

interface Props {
  formType: "login" | "register" | "forgotPassword" | "forgotPassword2";
  ctfOpen: boolean;
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
}

const inputStyles = "border-2 border-gray-300 rounded-md p-2 w-full";

const FormTemplate = ({ formType, onSubmit, ctfOpen }: Props) => {
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
        forgotPassword2: {
          securityQuestion: "",
          newPassword: "",
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
          {formType === "forgotPassword2" && (
            <>
              <Field
                name="forgotPassword2.securityQuestion"
                type="text"
                placeholder="Security Question"
                className={inputStyles}
                required
              />
              <Field
                name="forgotPassword2.newPassword"
                type="password"
                placeholder="New Password"
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
          {formType === "login" && ctfOpen && (
            <p className="text-center text-gray-500">
             Forgot your password?
              <a
                href={`/account/forgot-password`}
                className="text-blue-500 hover:underline"
                aria-label="Forgot password"
              >
                {" "}Reset it
              </a>
            </p>
          )}
          {formType === "forgotPassword2" && (
            <p className="text-center text-gray-500">
              Want to log in?
              <a
                href={`/account/authenticate`}
                className="text-blue-500 hover:underline"
                aria-label="Login"
              >
                Log in
              </a>
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default FormTemplate;
