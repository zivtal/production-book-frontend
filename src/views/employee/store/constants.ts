// actions
export const SEARCH_EMPLOYEES = 'searchEmployees';
export const GET_EMPLOYEE_DETAILS = 'getEmployeeDetails';
export const UPDATE_EMPLOYEE_PROFILE = 'updateEmployeeProfile';
export const GET_ALBUMS = 'getAlbums';
export const GET_ALBUM = 'getAlbum';
export const ADD_ALBUM = 'addAlbum';
export const UPLOAD_PHOTO = 'uploadPhoto';
export const UPDATE_ALBUM = 'updateAlbum';
export const UPDATE_ASSET = 'updateAsset';
export const REMOVE_ALBUM = 'removeAlbum';
export const REMOVE_ALBUM_ASSETS = 'removeAlbumAssets';
export const ADD_ALBUM_ASSETS = 'addAlbumAssets';
export const GET_REVIEWS = 'getReviews';
export const ADD_REVIEW = 'addReview';

// state
export const EMPLOYEES = 'employees';
export const EMPLOYEES_PAGINATION = 'employeesPagination';
export const EMPLOYEES_TOTAL = 'employeesTotal';
export const EMPLOYEE_DETAILS = 'employeeDetails';
export const EMPLOYEE_DETAILS_CACHE = 'employeeDetailsCache';
export const EMPLOYEE_ALBUM = 'employeeAlbum';
export const EMPLOYEE_ALBUM_CACHE = 'employeeAlbumCache';
export const EMPLOYEE_ALBUMS = 'employeeAlbums';
export const EMPLOYEE_REVIEWS = 'employeeReviews';
export const SELECTED_ASSET = 'selectedAsset';

// mutations
export const SET_EMPLOYEES = 'setEmployees';
export const SET_EMPLOYEE_DETAILS = 'setEmployeeDetails';
export const SET_EMPLOYEE_DETAILS_CACHE = 'setEmployeeDetailsCache';
export const UPDATE_EMPLOYEE_DETAILS = 'updateEmployeeDetails';
export const SET_EMPLOYEE_ALBUMS = 'setEmployeeAlbums';
export const SET_EMPLOYEE_REVIEWS = 'setEmployeeReviews';
export const CLEAR_EMPLOYEE_STATE = 'clearEmployeeState';
export const SET_EMPLOYEE_ALBUM = 'setEmployeeAlbum';
export const SET_EMPLOYEE_ALBUM_CACHE = 'setEmployeeAlbumCache';
export const SET_SELECTED_ASSET = 'setSelectedAsset';

// getters
export const GET_SELECTED_ALBUM = 'getSelectedAlbum';
export const GET_SELECTED_ASSET = 'getSelectedAsset';
