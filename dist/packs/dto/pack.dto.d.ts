export declare class CreatePackDto {
    title: string;
    description: string;
    startingPrice: number;
    durationDays: number;
    includedServices?: string[];
    isPublished?: boolean;
}
export declare class CreatePackOptionDto {
    label: string;
    description?: string;
    price: number;
}
