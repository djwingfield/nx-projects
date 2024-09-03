'use client';

import { Button, Form } from '@djwingfield/shadcn-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn, signUp } from '../lib/actions/user.actions';
import CustomInput from './CustomInput';

const password = () => z.string().min(8);

const getFormSchema = (type) =>
  z.object({
    firstName:
      type === 'sign-up' ? z.string().optional() : z.string().optional(),
    lastName:
      type === 'sign-up' ? z.string().optional() : z.string().optional(),
    address1:
      type === 'sign-up'
        ? z.string().max(50).optional()
        : z.string().optional(),
    city: type === 'sign-up' ? z.string().optional() : z.string().optional(),
    state: type === 'sign-up' ? z.string().optional() : z.string().optional(),
    postCode:
      type === 'sign-up' ? z.string().optional() : z.string().optional(),
    dateOfBirth:
      type === 'sign-up' ? z.string().optional() : z.string().optional(),
    ssn: type === 'sign-up' ? z.string().optional() : z.string().optional(),
    email: z.string().email(),
    password: password(),
    confirmPassword:
      type === 'sign-up' ? password().optional() : password().optional(),
  });

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = getFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: 'Dom',
      lastName: 'Wingfield',
      address1: 'Add 1',
      city: 'City',
      state: 'State',
      postCode: 'Post Code',
      dateOfBirth: 'DOB',
      ssn: '111222333444',
      email: 'test@test.com',
      password: 'test@test.com',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === 'sign-up') {
        const newUser = await signUp(data);
        setUser(newUser);
      }

      if (type === 'sign-in') {
        await signIn(data);
        router.push('/');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Wing Bank logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Wing Bank
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? 'Link your account to get started'
                : 'Please enter your details'}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <span>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      formControl={form.control}
                      name="firstName"
                      label="First name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      formControl={form.control}
                      name="lastName"
                      label="Last name"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomInput
                    formControl={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    formControl={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      formControl={form.control}
                      name="state"
                      label="State"
                      placeholder="ex: NY"
                    />
                    <CustomInput
                      formControl={form.control}
                      name="postCode"
                      label="Post code"
                      placeholder="ex: NG1 1NA"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      formControl={form.control}
                      name="dateOfBirth"
                      label="Date of birth"
                      placeholder="DD-MM-YYYY"
                    />
                    <CustomInput
                      formControl={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="ex: 1234"
                    />
                  </div>
                </>
              )}

              <CustomInput
                formControl={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
              <CustomInput
                formControl={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray 600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="form-link"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </span>
      )}
    </section>
  );
};

export default AuthForm;
