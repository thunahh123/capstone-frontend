
export const DeletePopup = function (props) {
    

    return(props.trigger)?(
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn btn btn-danger" onClick={()=>(props.setTrigger(false))}>&#10006;</button>
                {props.children}
            </div>

        </div>
    ):"";
}