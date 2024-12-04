// this function is to deal with the error message returned by server, example: "Bạn không được phép thực hiện hành động này do:\n• Một đảng viên chỉ có thể có 1 vai trò trong 1 chi bộ."
export function processErrMsg(message: string): string {
  return message.replaceAll("\n", "\n\n&nbsp;&nbsp;");
}
