import { AxiosRequestConfig } from "axios";

const getAxiosAuthConfig = (auth?: string): AxiosRequestConfig => {
    const options: AxiosRequestConfig = {
    }
    if (auth != null) {
        options.headers = {
            'Authorization': auth
        }
    }
    return options;
}

const getAuth = (auth?: string): {} => {
    return {
        'Authorization': auth.split(" ")[1]
    }
}

const getAxiosBaseUrl = (service: "task" | "user" | "todo"): string => {
    switch (service) {
        case "task":
            return process.env.BASE_TASK_URL
        case "user":
            return process.env.BASE_USER_URL
        case "todo":
            return process.env.BASE_TODO_URL    
    }
}

const areParametersValid = (...values: any[]) => {
    for (const v in values) {
        if (v == null || (typeof v === "string" && v === "")) return false;
    }
    return true;
}

export { areParametersValid, getAxiosAuthConfig, getAxiosBaseUrl, getAuth }