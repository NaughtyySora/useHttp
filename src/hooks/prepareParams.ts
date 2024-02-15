export type tURLParameters = Record<string, any> | Array<[string, any]>;

export const prepareParams = (params?: tURLParameters) => {
  const parsed = new URLSearchParams(params).toString();
  return parsed ? `?${parsed}` : parsed;
};