function Spinner() {
    return (
        <div className='loadingSpinnerContainer fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
            <div className='loadingSpinner w-16 h-16 border-8 border-t-8 border-gray-200 border-t-black rounded-full animate-spin'></div>
        </div>
    );
}
export default Spinner;
