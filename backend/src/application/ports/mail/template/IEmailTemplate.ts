export interface IEmailTemplate<TData> {
  render(data: TData): { subject: string; html: string };
}
