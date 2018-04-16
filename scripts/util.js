const childProcess = require('child_process')
function sh (shell) {
  return new Promise((resolve, reject) => {
    childProcess.exec(shell, (err, stdout, stderr) => {
      if (err) return reject(err)
      process.stdout.write(stdout)
      process.stderr.write(stderr)
      resolve()
    })
  })
}

exports.sh = sh
