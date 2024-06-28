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

interface IFormInput {
  email: string;
  password: string;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(3, {
    message: 'password cannot be null',
  }),
});

const CreateAccountPage = () => {
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  // const mutation = useMutation(
  //   async (data: IFormInput) => {
  //     const response = await fetch('/api/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Login failed');
  //     }

  //     return response.json();
  //   },
  //   {
  //     onSuccess: () => {
  //       router.push('/dashboard');
  //     },
  //     onError: (error: Error) => {
  //       console.error(error.message);
  //     },
  //   }
  // );

  // const onSubmit: SubmitHandler<IFormInput> = (data) => {
  //   mutation.mutate(data);
  // };

  return (
    <FluidContainer>
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <div className='text-center text-2xl text-muted-foreground mb-6'>
          CREATE FIRST ACCOUNT
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='username' {...field} />
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
              name='rePassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-type Password</FormLabel>
                  <FormControl>
                    <Input placeholder='password' {...field} />
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
