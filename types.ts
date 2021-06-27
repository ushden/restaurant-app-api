export interface JWTTypes {
	_id: string;
	roles: Array<string>;
}

export interface Dish {
	_id?: string;
	image: string;
	name: string;
	weight: number;
	price: number;
	ingredients: string;
	type: string;
	rate?: number;
}
