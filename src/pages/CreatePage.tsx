import { useQuery } from '@tanstack/react-query'
import { IoPencil, IoTrash } from 'react-icons/io5'
import Button from '../components/core/Button'
import LoadingSpinner from '../components/core/LoadingSpinner'
import { GetContentSection } from '../interfaces/apis/getContentSection.interface'
import { contentService } from '../services/content.service'

function CreatePages() {
  const { data: dataSection, isLoading } = useQuery<GetContentSection[]>({
    queryKey: ['getVideos'],
    queryFn: contentService.getSections,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })

  const onEdit = (item: GetContentSection) => {
    // Lógica para editar el video
    alert('EDITANDO')
  }

  const onDelete = (id: string) => {
    // Lógica para eliminar el video
    alert('ELIMNADO')
  }

  return (
    <main>
      <h1 className="text-3xl font-bold">Gestión de videos</h1>

      <div className='p-4'>
        {
          isLoading ? <>
            <div className='text-center flex flex-col gap-2'>
              <span className='text-lg font-light'>Cargando datos</span>
              <LoadingSpinner />
            </div>

          </> : <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {dataSection?.map((item) => {
              return <RenderVideo key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />;
            }) ?? []}
          </section>
        }
      </div>
    </main>
  )
}

const RenderVideo = ({ item, onEdit, onDelete }: { item: GetContentSection, onEdit: (item: GetContentSection) => void, onDelete: (id: string) => void }) => {
  return (
    <div className='bg-neutral-800 rounded-lg p-4'>
      <h2 className='text-lg font-bold py-2'>{item.title}</h2>
      <div>
        <img src={item.imagenUrl} alt={item.title} className='rounded-lg shadow-2xl' />
      </div>
      <div className='flex justify-between mt-2'>
        <Button onClick={() => onEdit(item)} theme='primary' icon={IoPencil}>Editar</Button>
        <Button onClick={() => onDelete(item.id)} theme='danger' icon={IoTrash}>Eliminar</Button>
      </div>
    </div>
  )
}

export default CreatePages