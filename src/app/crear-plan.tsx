
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
type Alimento = {
  id_alimento: number;
  nombre: string;
  categoria: string | null;
  unidad_base: string;
};
export default function CrearPlan() {
  const { id_estudiante, nombre, apellidos } = useLocalSearchParams();

  const [nombrePlan, setNombrePlan] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [calorias, setCalorias] = useState('');
  const [idPlan, setIdPlan] = useState<number | null>(null);
  const [guardandoPlan, setGuardandoPlan] = useState(false);
  const [alimentosDisponibles, setAlimentosDisponibles] = useState<Alimento[]>([]);
  const [nombreComida, setNombreComida] = useState('');
const [tipoComida, setTipoComida] = useState('desayuno');
const [diaPlan, setDiaPlan] = useState('1');
const [instrucciones, setInstrucciones] = useState('');

const [alimentoSeleccionado, setAlimentoSeleccionado] = useState('');
const [cantidad, setCantidad] = useState('');
const [unidad, setUnidad] = useState('g');

const [alimentosComida, setAlimentosComida] = useState<any[]>([]);
  const API_URL = 'http://192.168.0.10:3000';
const ID_NUTRIOLOGA = 2;
useEffect(() => {
  


  const cargarAlimentos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/planes/alimentos`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudo cargar el catálogo.');
      }

      setAlimentosDisponibles(datos);
      console.log('Alimentos cargados:', datos.length);

    } catch (error) {
      console.error('Error al cargar alimentos:', error);
      Alert.alert('Error', 'No se pudo cargar el catálogo de alimentos.');
    }
  };

  cargarAlimentos();
  const cargarPlanBorrador = async () => {
  try {
    const respuesta = await fetch(
      `${API_URL}/api/planes/estudiante/${id_estudiante}`
    );

    const planes = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error('No se pudieron consultar los planes.');
    }

    const borrador = planes.find(
      (plan: any) => plan.estado === 'borrador'
    );

    if (borrador) {
      setIdPlan(borrador.id_plan);
      setNombrePlan(borrador.nombre);
      setDescripcion(borrador.descripcion || '');
      setFechaInicio(
        new Date(borrador.fecha_inicio).toISOString().split('T')[0]
      );
      setFechaFin(
        borrador.fecha_fin
          ? new Date(borrador.fecha_fin).toISOString().split('T')[0]
          : ''
      );
      setCalorias(
        borrador.calorias_objetivo
          ? String(borrador.calorias_objetivo)
          : ''
      );

      Alert.alert(
        'Plan recuperado',
        'Se encontró un plan pendiente. Puedes continuar agregando comidas o publicarlo.'
      );
    }
  } catch (error) {
    console.error('Error al recuperar el plan:', error);
  }
};

cargarPlanBorrador();
}, []);
const guardarComida = async () => {
  if (!idPlan) {
    Alert.alert('Primero crea el plan', 'Guarda primero la información general del plan.');
    return;
  }

  if (!nombreComida.trim() || alimentosComida.length === 0) {
    Alert.alert('Datos incompletos', 'Ingresa el nombre de la comida y agrega al menos un alimento.');
    return;
  }

  if (!Number.isInteger(Number(diaPlan)) || Number(diaPlan) < 1) {
    Alert.alert('Día incorrecto', 'Ingresa un número de día válido.');
    return;
  }

  try {
    const respuesta = await fetch(
      `${API_URL}/api/planes/${idPlan}/comidas`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreComida.trim(),
          tipo: tipoComida,
          dia_plan: Number(diaPlan),
          instrucciones: instrucciones.trim() || null,
          alimentos: alimentosComida.map(alimento => ({
            id_alimento: alimento.id_alimento,
            cantidad: alimento.cantidad,
            unidad: alimento.unidad,
          })),
        }),
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo guardar la comida.');
    }

    Alert.alert('¡Comida guardada!', 'Se agregó correctamente al plan.');

    setNombreComida('');
    setAlimentosComida([]);
    setInstrucciones('');
    
  } catch (error) {
    console.error('Error al guardar comida:', error);
    Alert.alert(
      'Error',
      error instanceof Error ? error.message : 'No se pudo conectar con el servidor.'
    );
  }
};


const agregarAlimento = () => {
  if (!alimentoSeleccionado || !cantidad.trim()) {
    Alert.alert('Datos incompletos', 'Selecciona un alimento e ingresa su cantidad.');
    return;
  }

  const alimento = alimentosDisponibles.find(
    item => item.id_alimento === Number(alimentoSeleccionado)
  );

  if (!alimento) return;

  if (!Number.isFinite(Number(cantidad)) || Number(cantidad) <= 0) {
    Alert.alert('Cantidad incorrecta', 'Ingresa una cantidad mayor a cero.');
    return;
  }

  setAlimentosComida([
    ...alimentosComida,
    {
      id_alimento: alimento.id_alimento,
      nombre: alimento.nombre,
      cantidad: Number(cantidad),
      unidad,
    },
  ]);

  setAlimentoSeleccionado('');
  setCantidad('');
  setUnidad('g');
};

const guardarPlan = async () => {
        if (idPlan || guardandoPlan) {
    return;
  }

  if (!nombrePlan.trim() || !fechaInicio.trim()) {
    Alert.alert('Campos incompletos', 'Ingresa el nombre del plan y la fecha de inicio.');
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio)) {
    Alert.alert('Fecha incorrecta', 'Usa el formato AAAA-MM-DD.');
    return;
  }

  try {
    setGuardandoPlan(true);
    const respuesta = await fetch(`${API_URL}/api/planes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_estudiante: Number(id_estudiante),
        id_nutriologa: ID_NUTRIOLOGA,
        nombre: nombrePlan.trim(),
        descripcion: descripcion.trim(),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin || null,
        calorias_objetivo: calorias ? Number(calorias) : null,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo guardar el plan.');
    }

    setIdPlan(datos.plan.id_plan);

Alert.alert(
  '¡Plan guardado!',
  'Ahora puedes agregar las comidas de tu estudiante.'
);

    } catch (error) {
    console.error('Error al guardar:', error);
    Alert.alert(
      'Error',
      error instanceof Error ? error.message : 'No se pudo conectar con el servidor.'
    );
  } finally {
    setGuardandoPlan(false);
  }
};

const publicarPlan = async () => {
  if (!idPlan) {
    Alert.alert('Plan no guardado', 'Primero debes guardar el plan.');
    return;
  }

  Alert.alert(
    'Publicar plan',
    '¿Estás segura de que deseas publicar este menú para tu estudiante?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Publicar',
        onPress: async () => {
          try {
            const respuesta = await fetch(
              `${API_URL}/api/planes/${idPlan}/publicar`,
              {
                method: 'PUT',
              }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
              throw new Error(datos.mensaje || 'No se pudo publicar el plan.');
            }

            Alert.alert(
              '¡Plan publicado!',
              'Tu estudiante ya puede consultar su menú alimenticio.',
              [
                {
                  text: 'Aceptar',
                  onPress: () => router.back(),
                },
              ]
            );
          } catch (error) {
            Alert.alert(
              'Error',
              error instanceof Error
                ? error.message
                : 'No se pudo conectar con el servidor.'
            );
          }
        },
      },
    ]
  );
};
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>‹ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Crear plan alimenticio</Text>
        <Text style={styles.subtitulo}>
          Diseña un plan personalizado para tu estudiante.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.seccion}>Datos de la estudiante</Text>

        <Text style={styles.nombre}>
          {nombre} {apellidos}
        </Text>

        <Text style={styles.detalle}>
          Expediente: {id_estudiante}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.seccion}>Información del plan</Text>

        <Text style={styles.label}>Nombre del plan *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Plan alimenticio personalizado"
          value={nombrePlan}
          onChangeText={setNombrePlan}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.multilinea]}
          placeholder="Describe brevemente el objetivo del plan..."
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <Text style={styles.label}>Fecha de inicio *</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          value={fechaInicio}
          onChangeText={setFechaInicio}
        />

        <Text style={styles.label}>Fecha de finalización</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          value={fechaFin}
          onChangeText={setFechaFin}
        />

        <Text style={styles.label}>Calorías objetivo (kcal)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 1800"
          value={calorias}
          onChangeText={setCalorias}
          keyboardType="numeric"
        />
      </View>
      
<View style={styles.card}>
  <Text style={styles.seccion}>Agregar comidas al menú</Text>

  <Text style={styles.label}>Nombre de la comida</Text>
  <TextInput
    style={styles.input}
    placeholder="Ej. Huevos con verduras"
    value={nombreComida}
    onChangeText={setNombreComida}
  />

  <Text style={styles.label}>Tipo de comida</Text>
  {['desayuno', 'comida', 'cena', 'colacion'].map(tipo => (
    <TouchableOpacity
      key={tipo}
      style={{
        padding: 12,
        backgroundColor: tipoComida === tipo ? '#DCEAF5' : '#F8F8F8',
        borderRadius: 10,
        marginBottom: 7,
      }}
      onPress={() => setTipoComida(tipo)}
    >
      <Text style={{ color: '#1F416A' }}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Text>
    </TouchableOpacity>
  ))}

  <Text style={styles.label}>Día del plan</Text>
  <TextInput
    style={styles.input}
    placeholder="Ej. 1"
    value={diaPlan}
    onChangeText={setDiaPlan}
    keyboardType="numeric"
  />

  <Text style={styles.label}>Seleccionar alimento</Text>
  <View>
    {alimentosDisponibles.map(alimento => (
      <TouchableOpacity
        key={alimento.id_alimento}
        style={{
          padding: 12,
          borderRadius: 9,
          marginBottom: 5,
          backgroundColor:
            alimentoSeleccionado === String(alimento.id_alimento)
              ? '#DCEAF5'
              : '#F8F8F8',
        }}
        onPress={() => {
          setAlimentoSeleccionado(String(alimento.id_alimento));
          setUnidad(alimento.unidad_base);
        }}
      >
        <Text style={{ color: '#1F416A' }}>
          {alimento.nombre} {alimentoSeleccionado === String(alimento.id_alimento) ? '✓' : ''}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

  <Text style={styles.label}>Cantidad</Text>
  <TextInput
    style={styles.input}
    placeholder="Ej. 100"
    value={cantidad}
    onChangeText={setCantidad}
    keyboardType="decimal-pad"
  />

  <Text style={styles.label}>Unidad</Text>
  <TextInput
    style={styles.input}
    value={unidad}
    onChangeText={setUnidad}
    placeholder="g, ml, pieza..."
  />

  <TouchableOpacity
    style={[styles.boton, { marginHorizontal: 0, marginTop: 15 }]}
    onPress={agregarAlimento}
  >
    <Text style={styles.textoBoton}>+ Agregar alimento</Text>
  </TouchableOpacity>

  <Text style={styles.label}>Alimentos agregados</Text>

  {alimentosComida.map((alimento, index) => (
    <Text key={index} style={{ color: '#1F416A', marginTop: 8 }}>
      • {alimento.nombre}: {alimento.cantidad} {alimento.unidad}
    </Text>
  ))}
  
<Text style={styles.label}>Instrucciones de preparación</Text>
<TextInput
  style={[styles.input, styles.multilinea]}
  placeholder="Ej. Cocinar los huevos y acompañar con verduras..."
  value={instrucciones}
  onChangeText={setInstrucciones}
  multiline
/>

<TouchableOpacity
  style={[styles.boton, { marginHorizontal: 0, marginTop: 18 }]}
  onPress={guardarComida}
>
  <Text style={styles.textoBoton}>
    Guardar comida en el plan
  </Text>
</TouchableOpacity>

</View>

      <TouchableOpacity
  style={[
    styles.boton,
    (guardandoPlan || idPlan !== null) && { opacity: 0.6 }
  ]}
  onPress={guardarPlan}
  disabled={guardandoPlan || idPlan !== null}
>
  <Text style={styles.textoBoton}>
    {guardandoPlan
      ? 'Guardando...'
      : idPlan !== null
        ? 'Plan guardado ✓'
        : 'Continuar'}
  </Text>
</TouchableOpacity>
      {idPlan !== null && (
  <TouchableOpacity
    style={[
      styles.boton,
      { backgroundColor: '#1F416A', marginTop: 15 }
    ]}
    onPress={publicarPlan}
  >
    <Text style={styles.textoBoton}>
      ✓ Publicar plan para el estudiante
    </Text>
  </TouchableOpacity>
)}
      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },
  header: {
    padding: 22,
    paddingTop: 35,
  },
  volver: {
    color: '#4089C0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  titulo: {
    color: '#1F416A',
    fontSize: 25,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#687586',
    fontSize: 14,
    marginTop: 7,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 17,
    padding: 20,
    borderRadius: 18,
  },
  seccion: {
    color: '#1F416A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 17,
  },
  nombre: {
    color: '#1F416A',
    fontSize: 17,
    fontWeight: 'bold',
  },
  detalle: {
    color: '#77808D',
    marginTop: 5,
  },
  label: {
    color: '#1F416A',
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 13,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 11,
    padding: 13,
    color: '#333333',
    fontSize: 14,
  },
  multilinea: {
    height: 85,
    textAlignVertical: 'top',
  },
  boton: {
    backgroundColor: '#4089C0',
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
