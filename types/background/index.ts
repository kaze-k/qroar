export interface Message<T = any, P = any> {
  type: T;
  payload?: P;
}
