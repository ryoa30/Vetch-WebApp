// /lib/LoginValidator.ts
export type BlogInfoInput = {
  categoryId: string;
  title: string;
  content: string;
  image: File;
  id: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export class BlogValidator {
  validateBlogInfo(
    input: Partial<BlogInfoInput>
  ): ValidationResult<BlogInfoInput> {
    const errors: Record<string, string> = {};
    
    const title = input.title?.trim() || "";
    if (!title) {
      errors.title = "Title is required";
    } else if (title.length < 3 || title.length > 100) {
      errors.title = "Title must be between 3 and 100 characters";
    }

    const categoryId = input.categoryId?.trim() || "";
    if (!categoryId) {
      errors.categoryId = "Category is required";
    }

    const content = input.content?.trim() || "";
    if (!content) {
      errors.content = "Content is required";
    } else if (content.length < 20) {
      errors.content = "Content must be at least 20 characters";
    }

    const image = input.image;

    if( input.id === "add" ){
      if (!image) {
        errors.image = "Image is required";
      } else if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
        errors.image = "Image must be a JPEG, PNG, or WEBP file";
      }
    }

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      data: {
        title,
        categoryId,
        content,
        image: image as File,
        id: input.id || "",
      },
    };
  }
}
