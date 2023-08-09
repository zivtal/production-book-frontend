import type {
  ProfileFullDetails,
  SearchEmployeesRes,
  GetAlbumsReq,
  GetReviewsReq,
  GetReviewRes,
  Album,
  UpdateProfileReq,
  AddReviewReq,
  AlbumRes,
  AddAlbumReq,
  UploadAssetsReq,
  GetAlbumReq,
  UpdateAlbumReq,
  RemoveAssetsReq,
  SearchReq,
  AddAssetReq,
  UpdateAssetReq,
} from '@/views/employee/models';
import type { BaseResponse, BaseRecords, BaseId } from '@/shared/models';
import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';
import {
  ADD_ALBUM,
  ADD_ALBUM_ASSETS,
  ADD_REVIEW,
  GET_ALBUM,
  GET_ALBUMS,
  GET_EMPLOYEE_DETAILS,
  GET_REVIEWS,
  REMOVE_ALBUM,
  REMOVE_ALBUM_ASSETS,
  SEARCH_EMPLOYEES,
  UPDATE_ALBUM,
  UPDATE_ASSET,
  UPDATE_EMPLOYEE_PROFILE,
  UPLOAD_PHOTO,
} from '@/views/employee/store/constants';

@injectable()
export default class EmployeeService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/employee';

  public [SEARCH_EMPLOYEES](payload?: SearchReq): Promise<SearchEmployeesRes> {
    return this.apiService.post<SearchEmployeesRes>(`${this.baseUrl}/${SEARCH_EMPLOYEES}`, payload);
  }

  public [GET_EMPLOYEE_DETAILS](userId: BaseId): Promise<ProfileFullDetails> {
    return this.apiService.get<ProfileFullDetails>(`${this.baseUrl}/${GET_EMPLOYEE_DETAILS}?id=${userId}`);
  }

  public [GET_ALBUMS](payload: GetAlbumsReq): Promise<BaseRecords<Album>> {
    return this.apiService.post<BaseRecords<Album>>(`${this.baseUrl}/${GET_ALBUMS}`, payload);
  }

  public [GET_ALBUM](payload: GetAlbumReq): Promise<AlbumRes> {
    return this.apiService.post<AlbumRes>(`${this.baseUrl}/${GET_ALBUM}`, payload);
  }

  public [ADD_ALBUM](payload: AddAlbumReq): Promise<AlbumRes> {
    return this.apiService.post<AlbumRes>(`${this.baseUrl}/${ADD_ALBUM}`, payload);
  }

  public [UPLOAD_PHOTO](payload: UploadAssetsReq, albumId: BaseId): Promise<BaseResponse> {
    const formData = new FormData();
    payload.forEach(({ file, thumb, size }) => {
      formData.append('images', file);
      formData.append('thumbs', thumb);
      formData.append('sizes', size.toString());
    });

    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${UPLOAD_PHOTO}/${albumId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60 * 60 * 1000,
    });
  }

  public [UPDATE_ALBUM](payload: UpdateAlbumReq): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(`${this.baseUrl}/${UPDATE_ALBUM}`, payload);
  }

  public [UPDATE_ASSET](payload: UpdateAssetReq): Promise<BaseResponse> {
    return this.apiService.put<BaseResponse>(`${this.baseUrl}/${UPDATE_ASSET}`, payload);
  }

  public [REMOVE_ALBUM](albumId: BaseId): Promise<BaseResponse> {
    return this.apiService.delete<BaseResponse>(`${this.baseUrl}/${REMOVE_ALBUM}/${albumId}`);
  }

  public [REMOVE_ALBUM_ASSETS](payload: RemoveAssetsReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${REMOVE_ALBUM_ASSETS}`, payload);
  }

  public [ADD_ALBUM_ASSETS](payload: AddAssetReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${ADD_ALBUM_ASSETS}`, payload);
  }

  public [GET_REVIEWS](payload: GetReviewsReq): Promise<BaseRecords<GetReviewRes>> {
    return this.apiService.post<BaseRecords<GetReviewRes>>(`${this.baseUrl}/${GET_REVIEWS}`, payload);
  }

  public [UPDATE_EMPLOYEE_PROFILE](payload: UpdateProfileReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${UPDATE_EMPLOYEE_PROFILE}`, payload);
  }

  public [ADD_REVIEW](payload: AddReviewReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${ADD_REVIEW}`, payload);
  }
}
