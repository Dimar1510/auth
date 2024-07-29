import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "src/app/hooks";
import {
  useLoginMutation,
  useRegisterMutation,
} from "src/app/services/userApi";
import { selectIsAuthenticated } from "src/app/userSlice";
import FormInput from "src/components/ui/FormInput/FormInput";
import ErrorMessage from "src/components/ui/error-message/ErrorMessage";
import { hasErrorField } from "src/utils/has-error-field";

interface IRegister {
  username: string;
  email: string;
  password: string;
}

const Register = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const { handleSubmit, control, getValues } = useForm<IRegister>({
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [register, regResult] = useRegisterMutation();
  const [login, logResult] = useLoginMutation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  const onSubmit = async (data: IRegister) => {
    try {
      await register(data).unwrap();
      await login(data).unwrap();
      navigate("/");
    } catch (error) {
      if (hasErrorField(error)) {
        setError(error.data.error);
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-center my-7">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          control={control}
          name="username"
          label="Username"
          type="text"
          required="Username required"
        />
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          required="Email required"
        />
        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          required="Password required"
        />

        <ErrorMessage error={error} />
        <Button
          color="success"
          type="submit"
          isLoading={regResult.isLoading || logResult.isLoading}
          className="text-white font-semibold"
        >
          Sign up
        </Button>
      </form>
      <div className="flex gap-2 justify-center my-3">
        <p>Already have an account?</p>
        <Link to={"/login"} className="text-primary-500 font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;