function pagination(total, currentPage, perPage = 2) {
    const pageNumber = currentPage == null ? 1 : currentPage;
    const pages = Math.ceil(total / perPage);
    const startFrom = (pageNumber - 1) * perPage;

    return { startFrom, perPage, pages };
}

module.exports = pagination;
