
export const ResultPostCard = function (props) {
    return(props.trigger)?(
        <div className="popup z-3">
            <div className="popup-inner">
                <button className="close-btn btn btn-danger" onClick={()=>(props.setTrigger(false))}>&#10006;</button>
                {props.children}
            </div>

        </div>
    ):"";
}