

const calTotalPages = (numPerPage, length) => {
    if (numPerPage == null){
        return 1
    }
    var pages = Math.floor(length / numPerPage)
    if (length % numPerPage != 0){
        pages += 1
    }

    return pages
}

module.exports = {calTotalPages}