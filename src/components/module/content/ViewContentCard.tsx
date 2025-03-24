import { GetAllContentBySectionIdData } from "../../../interfaces/apis/getAllContentBySectionId"
import { formatedText } from "../../../utils/formatedText"
import Card from "../../ui/Card"

interface IViewContentCard {
  item: GetAllContentBySectionIdData
}

function ViewContentCard({ item }: IViewContentCard) {
  return (
    <Card>
      <Card.Header>
        <h3 className="font-bold text-blue-200">{item?.content?.title || 'Sin titulo disponible'}</h3>
      </Card.Header>
      <Card.Body>
        <div className="bg-neutral-800 px-2 w-max rounded-lg my-1">{item.contentType}</div>
        <p>{formatedText(item?.content?.description || 'Sin titulo disponible')}</p>
      </Card.Body>
    </Card>
  )
}

export default ViewContentCard
