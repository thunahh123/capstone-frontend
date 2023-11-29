
export const HomeResultCard = function (props) {
    console.log("HomeResultCard");
    return (
        <div className="p-lg-2 col-12 col-lg-6 col-xxl-4">
        <div className="bg-secondary rounded-5 px-3 py-1 my-2 d-flex d-lg-block gap-3 align-items-center h-100">
            <svg
                className="bd-placeholder-img rounded-circle flex-shrink-0 my-2"
                width="140"
                height="140"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Placeholder"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
            >
                <title>{props.recipe.title}</title>
                <rect
                    width="100%"
                    height="100%"
                    fill="var(--bs-secondary-color)"
                ></rect>
            </svg>
            <div className="d-flex flex-column flex-grow-1">
            <h2 className="fw-normal"><a className="link-underline link-underline-opacity-0" href={"/recipe/"+props.recipe.id}>{props.recipe.title}</a></h2>
                <span className="flex-grow-1">{props.recipe.description.length>120 ? props.recipe.description.split('').splice(0,117).join('')+"..." : props.recipe.description}</span>
            <p>
                <a className="btn btn-primary " rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>
                    View details »
                </a>
            </p>
            </div>
        </div>
        </div>
    )
}