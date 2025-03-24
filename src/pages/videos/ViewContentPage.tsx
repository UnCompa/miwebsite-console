import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NotContent from '../../components/core/NotContent'
import ViewContentCard from '../../components/module/content/ViewContentCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { contentService } from '../../services/content.service'

function ViewContentPages() {
  const { sectionId } = useParams()
  const { data: dataSection, isLoading, isError } = useQuery({
    queryKey: ['getAllContent', sectionId], // Incluye sectionId en la queryKey para que sea única por sección
    queryFn: () => contentService.getAllContentBySectionId(sectionId ? sectionId : ''), // Pasa una función, no el resultado
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });
  const navigate = useNavigate()
  useEffect(() => {
    if (isError) {
      navigate('/login')
    }
  }, [isError, navigate])
  return (
    <main>
      <h1 className="text-3xl font-bold">{dataSection?.sectionDetails.title}</h1>

      <div className='p-4'>
        {
          isLoading ? <>
            <div className='text-center flex flex-col gap-2'>
              <span className='text-lg font-light'>Cargando datos</span>
              <LoadingSpinner />
            </div>

          </> : Array.isArray(dataSection?.data) && dataSection?.data.length > 1 ? <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {dataSection?.data?.map((item) => {
              return <ViewContentCard item={item} />;
            }) ?? []}
          </section> : <NotContent />
        }
      </div>
    </main>
  )
}


export default ViewContentPages