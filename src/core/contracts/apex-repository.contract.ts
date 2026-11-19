export interface ApexApplicationSummary {
  applicationId: number
  applicationName: string
  owner: string
  pageCount: number
}

export interface ApexPageSummary {
  pageId: number
  pageName: string
  pageType: string
}

export interface ApexRepository {
  getApplicationPages(applicationId: number): Promise<ApexPageSummary[]>
  listApplications(): Promise<ApexApplicationSummary[]>
}