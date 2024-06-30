'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { Button, Input, Form, FormField, FormLabel } from 'shadcn-ui';
// import

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { FluidContainer } from '@/components/container/FluidContainer';
import { useMutateRegisterAccount } from '@/queries/auth';

interface IFormInput {
  email: string;
  name: string;
  password: string;
  retypePassword: string;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is invalid'),
  password: z.string().min(1, 'Password is required'),
  // retypePassword: z.string().min(1, 'retype password is required'),
});
// .refine((data) => data.password === data.retypePassword, {
//   path: ['retypePassword'],
//   message: 'Passwords must match',
// });

const CreateAccountPage = () => {
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const password = watch('password', '');

  const mutateRegister = useMutateRegisterAccount();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    mutateRegister.mutate(values);
  };

  return (
    <FluidContainer>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <div className='text-center text-2xl text-muted-foreground mb-6'>
          CREATE ACCOUNT
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='retypePassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder='retype Password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </div>
    </FluidContainer>
  );
};

export default CreateAccountPage;
