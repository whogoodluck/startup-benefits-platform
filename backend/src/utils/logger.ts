function info(...msgs: string[]) {
  console.log(...msgs)
}

function error(...msgs: string[]) {
  console.error(...msgs)
}

export default {
  info,
  error,
}
