export class OptionsProductForm<T> {
    value: T | undefined;
    key: string;
    required: boolean;
    variants: {
        key: string;
        value: {
            key: string; value: string, required: boolean
        }[]
    }[];
    constructor(
        options: {
            value?: T;
            key?: string;
            label?: string;
            required?: boolean;
            order?: number;
            controlType?: string;
            type?: string;
            variants?: {
                key: string;
                value: {
                    key: string; value: string, required: boolean
                }[]
            }[];
        } = {},
    ) {
        this.value = options.value;
        this.key = options.key || '';
        this.required = !!options.required;
        this.variants = options.variants || [];
    }
}