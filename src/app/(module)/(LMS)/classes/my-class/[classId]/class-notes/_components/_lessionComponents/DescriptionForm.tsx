"use client"

import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"
import { useState } from "react"

export const DescriptionForm = () => {
  const [isEditing, setIsEditing] = useState(false)
  const toggleEdit = () => setIsEditing((current) => !current)

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {/* {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "No description"}
                </p>
            )} */}
      {isEditing && (
        <form
          // onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4"
        >
          <FormField
            // control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    // disabled={isSubmitting}
                    placeholder="e.g. 'This course about ...'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button
              // disabled={!isValid || isSubmitting}
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
