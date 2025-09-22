// /lib/services/AuthService.ts
import { HttpClient } from "../http/HttpClient";
import { API_URL } from "@/constant/apiConstant";
import { IResponse } from "../http/types";


export class BlogService {
  #http: HttpClient = new HttpClient({baseUrl: API_URL.BLOG});

    async createBlog(categoryId: string, title: string, content: string, image: File) {
        const formData = new FormData();
        const payload = {
            categoryId,
            title,
            context: content
        }
        formData.append('data', JSON.stringify(payload));
        formData.append('file', image);

        return await this.#http.postForm<IResponse>("/", formData);
    }

    async getBlogs(page: number, volume: number, query: string = '') {
    return await this.#http.get<IResponse>(`/?page=${page}&volume=${volume}&query=${query}`);
  }

    async getAllCategories() {
        return await this.#http.get<IResponse>("/categories");
    }

    async getBlogById(id: string) {
        return await this.#http.get<IResponse>(`/${id}`);
    }
  
    async updateBlog(id: string, categoryId: string, title: string, content: string, image: File | null) {
        const formData = new FormData();
        const payload = {
            id,
            categoryId,
            title,
            context: content
        }
        formData.append('data', JSON.stringify(payload));
        if(image) formData.append('file', image);

        return await this.#http.putForm<IResponse>(`/`, formData);
    }

    async deleteBlog(id: string) {
        return await this.#http.delete<IResponse>(`/${id}`);
    }

}
