// me define some fn for normal use 
// this is normal js

export const formatLeft = (eta) => {
    eta = eta/1000/60
    let mm = Math.floor(eta)
    let ss = `${Math.floor((eta - mm)*60)}`.padStart(2, "0")
    return `${mm}:${ss}`
}

export const formatTime = (time) => {
    time = new Date(time)
    let hh = `${time.getHours()}`.padStart(2, "0")
    let mm = `${time.getMinutes()}`.padStart(2, "0")
    let ss = `${time.getSeconds()}`.padStart(2, "0")
    return `${hh}:${mm}:${ss}`
}