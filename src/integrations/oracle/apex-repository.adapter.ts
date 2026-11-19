import type {ApexApplicationSummary, ApexPageSummary, ApexRepository} from '../../core/contracts/apex-repository.contract.js'
import type {OracleConnection} from '../../core/contracts/oracle-connection.contract.js'

export class ApexRepositoryAdapter implements ApexRepository {
  constructor(private readonly connection: OracleConnection) {}

  async getApplicationPages(applicationId: number): Promise<ApexPageSummary[]> {
    const rows = await this.connection.query<{PAGE_ID: number; PAGE_NAME: string; PAGE_TYPE: string}>(
      `select page_id, page_name, page_type
       from apex_application_pages
       where application_id = :appId
       order by page_id`,
      {appId: applicationId},
    )

    return rows.map((row) => ({
      pageId: row.PAGE_ID,
      pageName: row.PAGE_NAME,
      pageType: row.PAGE_TYPE,
    }))
  }

  async listApplications(): Promise<ApexApplicationSummary[]> {
    const rows = await this.connection.query<{
      APPLICATION_ID: number
      APPLICATION_NAME: string
      OWNER: string
      PAGE_COUNT: number
    }>(
      `select a.application_id,
              a.application_name,
              a.owner,
              count(p.page_id) as page_count
       from apex_applications a
       left join apex_application_pages p on p.application_id = a.application_id
       group by a.application_id, a.application_name, a.owner
       order by a.application_id`,
    )

    return rows.map((row) => ({
      applicationId: row.APPLICATION_ID,
      applicationName: row.APPLICATION_NAME,
      owner: row.OWNER,
      pageCount: row.PAGE_COUNT,
    }))
  }
}