export const formatDate = (eta) => {
    let diff = (new Date(eta) - new Date())/1000/60
    let mm = Math.floor(diff)
    let ss = `${Math.floor((diff - mm)*60)}`.padStart(2, "0")
    return `${mm}:${ss}`
}