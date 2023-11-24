export const SearchResultCard = function (params) {
    return (
        <div className="d-flex mx-auto my-2 col-8 bg-light ">
            <div className="my-auto">
                <svg
                    className="bd-placeholder-img rounded-circle"
                    width="140"
                    height="140"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Placeholder"
                    preserveAspectRatio="xMidYMid slice"
                    focusable="false"
                >
                    <title></title>
                    <rect
                        width="100%"
                        height="100%"
                        fill="var(--bs-secondary-color)"
                    ></rect>
                </svg>
            </div>
            <div className="ps-2">
                <div>
                    </div><h2 className="fw-normal"><a rel="noreferrer noopener" target="_blank" href={"/recipe/" + params.recipe.id}>{params.recipe.title}</a></h2>
                <span>{params.recipe.matching_ingredients} matches</span>
                <p>
                    Do you have: {params.recipe.ingredients.filter(i=> !params.searched.includes(i.id) ).map(i=>i.name).join(", ")}
                </p>
                <p>
                    <a className="btn btn-secondary" rel="noreferrer noopener" target="_blank" href={"/recipe/" + params.recipe.id}>
                        View details »
                    </a>
                </p>
            </div>


        </div>
    )
}