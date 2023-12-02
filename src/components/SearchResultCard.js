import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const SearchResultCard = function (props) {
    return (
        <div className="d-flex mx-auto my-2 col-8 bg-secondary rounded-5 px-3 py-1">
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
                </div><h2 className="fw-normal"><a className="link-underline link-underline-opacity-0" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>{props.recipe.title}</a></h2>
                <div className="d-flex column-gap-5 row-gap-1 flex-wrap mb-2">
                    <span className="">by&nbsp;<strong>{props.recipe.user?.name}</strong></span>
                    <span className="">{new Date(props.recipe.created_at).toLocaleDateString()}</span>
                    <span className="d-flex flex-nowrap align-items-center">{props.recipe.avg_rating}&nbsp;<FontAwesomeIcon icon={faStar}/>({props.recipe.ratings.length})</span>
                    <span className="">{props.recipe.views} views</span>
                </div>
                <span className="">{props.recipe.matching_ingredients} matches</span>    
                <p>
                    
                    Do you have: {props.recipe.ingredients.filter(j => !props.searched.includes(j.id)).map((i, index) => (<><button className="btn btn-link p-0" onClick={() => { props.addIngredient(i.name, i.id) }} title="Add to ingredients?">{i.name}</button>{index !== props.recipe.ingredients.filter(j => !props.searched.includes(j.id)).length - 1 ? ", " : "?"}</>))}
                </p>
                <p>
                    <a className="btn btn-primary" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>
                        View details »
                    </a>
                </p>
            </div>
        </div>
    )
}