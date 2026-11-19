import type {ApexApplicationSummary, ApexPageSummary} from '../../core/contracts/apex-repository.contract.js'

import {resolveOracleCredentials} from '../../config/oracle-profile.js'
import {ApexRepositoryAdapter} from '../../integrations/oracle/apex-repository.adapter.js'
import {OracleConnectionAdapter} from '../../integrations/oracle/oracle-connection.adapter.js'

export interface ApexInspectResult {
  applications?: ApexApplicationSummary[]
  configured: boolean
  error?: string
  pages?: ApexPageSummary[]
}

export class ApexInspectService {
  async run(applicationId?: number, connectionName?: string): Promise<ApexInspectResult> {
    const connection = new OracleConnectionAdapter(resolveOracleCredentials(connectionName))
    const repository = new ApexRepositoryAdapter(connection)

    try {
      if (applicationId === undefined) {
        const applications = await repository.listApplications()
        return {applications, configured: true}
      }

      const pages = await repository.getApplicationPages(applicationId)
      return {configured: true, pages}
    } catch (error) {
      return {configured: true, error: (error as Error).message}
    } finally {
      await connection.close()
    }
  }
}