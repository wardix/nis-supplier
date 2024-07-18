import { Hono } from 'hono'
import { RowDataPacket } from 'mysql2/promise'
import { dbPool } from './database'

const app = new Hono()

app.get('/subscribers', async (c) => {
  const operators = (c.req.query('operator') as string).split(',')
  const operatorsPlaceholder = Array(operators.length).fill('?').join(', ')
  const sql = `
    SELECT fvs.typeId csid, cs.CustAccName acc, cs.CustStatus status,
           fvs.vendor_cid cid, fvs.tagihan_otc otc, fvs.tagihan charge,
           fvs.tanggal_aktivasi activationDate, cs.CustUnregDate terminatedDate,
           cs.CustBlockDate blockDate, fvs.show active
    FROM FiberVendorServices fvs
    LEFT JOIN CustomerServices cs ON fvs.typeId = cs.CustServId
    WHERE fvs.type = 'CustomerServices'
    AND fvs.typeId > 0
    AND fvs.vendor_id IN (${operatorsPlaceholder})
  `
  const [rows] = await dbPool.execute<RowDataPacket[]>(sql, operators)
  return c.json(rows)
})

export default app
