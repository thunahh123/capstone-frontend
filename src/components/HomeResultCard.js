
export const HomeResultCard = function (params) {
    console.log("HomeResultCard");
    return (
        <div className="col-lg-4">
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
            <h2 className="fw-normal">{params.recipe.title}</h2>
            <p>
                {params.recipe.description}
            </p>
            <p>
                <a className="btn btn-secondary" href="#">
                    View details »
                </a>
            </p>
        </div>
    )
}