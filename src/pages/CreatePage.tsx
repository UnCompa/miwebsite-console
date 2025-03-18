import { useQuery } from '@tanstack/react-query'
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
              return <RenderVideo item={item} />;
            }) ?? []}
          </section>
        }
      </div>
    </main>
  )
}

const RenderVideo = ({ item }: { item: GetContentSection }) => {
  return (
    <div className='bg-neutral-800 rounded-lg p-4'>
      <h2 className='text-lg font-light'>{item.title}</h2>
      <div>
        <img src={item.imagenUrl} alt="" />
      </div>
    </div>
  )
}

export default CreatePages