export type CategoriesState = {
  fetched: boolean;
  fetching: boolean;
  error: CategoriesError;
  allIds: string[];
  byId: Partial<{
    [key: string]: Category;
  }>;
  form: Partial<{
    [key: string]: CategoryForm;
  }>;
};

export type CategoriesError = string;

export interface Category {
  _id: string;
  boardid: string;
  title: string;
  createdOn: Date;
  updatedOn: Date;
  archived: boolean;
}

export type CategoryForm = Pick<Category, '_id' | 'title' >;