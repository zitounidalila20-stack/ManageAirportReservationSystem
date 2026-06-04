

export default function WarningHeadUp(){
    return(
      <div className="px-8 py-6 bg-yellow-400 text-white flex justify-between rounded">
        <div className="flex items-center">
          <svg className="h-7 w-7 mr-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <p>Warning! This is a warning alert—check it out!</p>
        </div>
      </div>
    );
}