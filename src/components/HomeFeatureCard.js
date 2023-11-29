import myImage from "../images/soup.jpg";
function HomeFeatureImage(props) {
    return (
        <div className={`col-md-5 order-md-${(props.index % 2) + 1}`}>
            <img
                src={myImage}
                width="500px"
                height="500px"
                preserveAspectRatio="xMidYMid slice"
                className="img-fluid"
            ></img>
        </div >
    );
}
function HomeFeatureInfo(props) {
    return (
        <div className={`col-md-7 order-md-${2 - (props.index % 2)}`}>
            <h2 className="featurette-heading fw-normal lh-1">
                <a className="text-primary link-underline link-underline-opacity-0" rel="noreferrer noopener" target="_blank" href={"/recipe/" + props.recipe.id}>{props.recipe.title}</a>
            </h2>
            <p className="lead">
                {props.recipe.description}
            </p>
        </div>
    );
}
export const HomeFeatureCard = function (props) {
    console.log(props.index % 2 === 0);
    return (
        <>
            <div className="row featurette">
                <HomeFeatureInfo recipe={props.recipe} index={props.index} />
                <HomeFeatureImage index={props.index} />
            </div>
            <hr className="featurette-divider" />
        </>
    )
}