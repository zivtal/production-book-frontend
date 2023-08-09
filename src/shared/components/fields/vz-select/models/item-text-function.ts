import { ItemFunctionArg } from './item-function-arg';

export type ItemTextProp = string | ((item: ItemFunctionArg) => string);

export type ItemTextReturn = (item: ItemFunctionArg) => string;
