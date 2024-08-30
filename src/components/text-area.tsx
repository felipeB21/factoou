"use client";

import { Button, Textarea, FormControl, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface FormData {
  body: string;
}

export default function TextArea() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();

      toast({
        title: "Post Created",
        description: "Your post has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      window.location.reload();

      reset();
    } catch (error) {
      console.error("Error:", error);

      toast({
        title: "Error",
        description: "An error occurred while creating the post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <Textarea
          placeholder="Tell us the Factoou of the day"
          size="sm"
          resize="none"
          {...register("body", { required: true })}
        />
      </FormControl>
      <Button
        mt={4}
        colorScheme="yellow"
        type="submit"
        isLoading={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}
