import { ItemFunctionArg } from './item-function-arg';

export type ItemValueProp = string | ((item: ItemFunctionArg) => any);

export type ItemValueReturn = (item: ItemFunctionArg) => any;
