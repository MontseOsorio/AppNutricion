
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

type AlimentoComida = {
  id_alimento: number;
  nombre: string;
  cantidad: number;
  unidad: string;
};

type ComidaPlan = {
  id_comida: number;
  nombre: string;
  tipo: string;
  dia_plan: number;
  instrucciones: string | null;
  detalle_comidas: {
    id_alimento: number;
    cantidad: number | string;
    unidad: string;
    alimento: {
      nombre: string;
    };
  }[];
};
type IngredientePropuesto = {
  nombre: string;
  cantidad: number;
  unidad: string;
  id_alimento: number | null;
  en_catalogo: boolean;
  estado: string;
};

type ComidaPropuesta = {
  tipo: string;
  nombre: string;
  instrucciones?: string;
  ingredientes: IngredientePropuesto[];
};

type DiaPropuesto = {
  dia: number;
  comidas: ComidaPropuesta[];
};

type PropuestaMenu = {
  dias: DiaPropuesto[];
  observaciones?: string[];
};
const API_URL = 'http://192.168.0.10:3000';
const ID_NUTRIOLOGA = 2;

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
];

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
  const [comidasPlan, setComidasPlan] = useState<ComidaPlan[]>([]);
  const [cargandoComidas, setCargandoComidas] = useState(false);

  const [nombreComida, setNombreComida] = useState('');
  const [tipoComida, setTipoComida] = useState('desayuno');
  const [diaPlan, setDiaPlan] = useState('1');
  const [instrucciones, setInstrucciones] = useState('');

  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('g');

  const [alimentosComida, setAlimentosComida] = useState<AlimentoComida[]>([]);
  const [idComidaEditando, setIdComidaEditando] = useState<number | null>(null);
  const [guardandoComida, setGuardandoComida] = useState(false);
  // Estados para generar menús con Azure AI
const [diasIA, setDiasIA] = useState('5');
const [preferenciasIA, setPreferenciasIA] = useState('');
const [restriccionesIA, setRestriccionesIA] = useState('');
const [indicacionesIA, setIndicacionesIA] = useState('');
const [propuestaIA, setPropuestaIA] = useState<PropuestaMenu | null>(null);
const [generandoIA, setGenerandoIA] = useState(false);
const [guardandoPropuestaIA, setGuardandoPropuestaIA] = useState(false);
const [propuestaImportada, setPropuestaImportada] = useState(false);
  // Cargar alimentos y recuperar el plan existente.
  useEffect(() => {
    cargarAlimentos();
    cargarPlanExistente();
  }, []);

  const cargarAlimentos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/planes/alimentos`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudo cargar el catálogo.');
      }

      setAlimentosDisponibles(datos);
    } catch (error) {
      console.error('Error al cargar alimentos:', error);
      Alert.alert('Error', 'No se pudo cargar el catálogo de alimentos.');
    }
  };

  const cargarPlanExistente = async () => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/planes/estudiante/${id_estudiante}`
      );

      const planes = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar los planes.');
      }

      const planExistente =
        planes.find((plan: any) => plan.estado === 'borrador') ||
        planes.find((plan: any) => plan.estado === 'activo');

      if (planExistente) {
        cargarDatosPlan(planExistente);

        Alert.alert(
          'Plan recuperado',
          'Se encontró un plan existente. Puedes agregar comidas nuevas o editar las que ya tiene.'
        );
      }
    } catch (error) {
      console.error('Error al recuperar el plan:', error);
    }
  };

  const cargarDatosPlan = (plan: any) => {
    setIdPlan(plan.id_plan);
    setNombrePlan(plan.nombre || '');
    setDescripcion(plan.descripcion || '');

    setFechaInicio(
      plan.fecha_inicio
        ? new Date(plan.fecha_inicio).toISOString().split('T')[0]
        : ''
    );

    setFechaFin(
      plan.fecha_fin
        ? new Date(plan.fecha_fin).toISOString().split('T')[0]
        : ''
    );

    setCalorias(
      plan.calorias_objetivo
        ? String(plan.calorias_objetivo)
        : ''
    );

    setComidasPlan(plan.comidas || []);
  };

  const actualizarListaComidas = async () => {
    if (!id_estudiante) return;

    try {
      setCargandoComidas(true);

      const respuesta = await fetch(
        `${API_URL}/api/planes/estudiante/${id_estudiante}`
      );

      const planes = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error('No se pudieron actualizar las comidas.');
      }

      const planActual = planes.find(
        (plan: any) => plan.id_plan === idPlan
      );

      if (planActual) {
        setComidasPlan(planActual.comidas || []);
      }
    } catch (error) {
      console.error('Error al actualizar comidas:', error);
      Alert.alert('Error', 'No se pudo actualizar la lista de comidas.');
    } finally {
      setCargandoComidas(false);
    }
  };

  const limpiarFormularioComida = () => {
    setNombreComida('');
    setTipoComida('desayuno');
    setDiaPlan('1');
    setInstrucciones('');
    setAlimentosComida([]);
    setAlimentoSeleccionado('');
    setCantidad('');
    setUnidad('g');
    setIdComidaEditando(null);
  };

  // Seleccionar una comida existente para editarla.
  const editarComida = (comida: ComidaPlan) => {
    setIdComidaEditando(comida.id_comida);
    setNombreComida(comida.nombre);
    setTipoComida(comida.tipo);
    setDiaPlan(String(comida.dia_plan));
    setInstrucciones(comida.instrucciones || '');

    setAlimentosComida(
      (comida.detalle_comidas || []).map(detalle => ({
        id_alimento: detalle.id_alimento,
        nombre: detalle.alimento?.nombre || 'Alimento',
        cantidad: Number(detalle.cantidad),
        unidad: detalle.unidad,
      }))
    );

    setAlimentoSeleccionado('');
    setCantidad('');
    setUnidad('g');

    Alert.alert(
      'Editando comida',
      'Modifica los datos y guarda los cambios.'
    );
  };

  const agregarAlimento = () => {
    if (!alimentoSeleccionado || !cantidad.trim()) {
      Alert.alert(
        'Datos incompletos',
        'Selecciona un alimento e ingresa su cantidad.'
      );
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

  const quitarAlimento = (indice: number) => {
    setAlimentosComida(
      alimentosComida.filter((_, index) => index !== indice)
    );
  };

  // Guardar una comida nueva o actualizar una existente.
  const guardarComida = async () => {
    if (!idPlan) {
      Alert.alert(
        'Primero crea el plan',
        'Guarda primero la información general del plan.'
      );
      return;
    }

    if (!nombreComida.trim() || alimentosComida.length === 0) {
      Alert.alert(
        'Datos incompletos',
        'Ingresa el nombre de la comida y agrega al menos un alimento.'
      );
      return;
    }

    if (
      !Number.isInteger(Number(diaPlan)) ||
      Number(diaPlan) < 1 ||
      Number(diaPlan) > 5
    ) {
      Alert.alert(
        'Día incorrecto',
        'Selecciona un día entre lunes y viernes (1 al 5).'
      );
      return;
    }

    try {
      setGuardandoComida(true);

      const editando = idComidaEditando !== null;

      const url = editando
        ? `${API_URL}/api/planes/${idPlan}/comidas/${idComidaEditando}`
        : `${API_URL}/api/planes/${idPlan}/comidas`;

      const respuesta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
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
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo guardar la comida.');
      }

      Alert.alert(
        editando ? '¡Comida actualizada!' : '¡Comida guardada!',
        editando
          ? 'Los cambios se guardaron correctamente.'
          : 'Se agregó correctamente al plan.'
      );

      limpiarFormularioComida();
      await actualizarListaComidas();

    } catch (error) {
      console.error('Error al guardar comida:', error);

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor.'
      );
    } finally {
      setGuardandoComida(false);
    }
  };
  const generarMenuIA = async () => {
  if (!calorias.trim() || Number(calorias) <= 0) {
    Alert.alert('Atención', 'Ingresa primero las calorías objetivo del menú.');
    return;
  }

  try {
    setGenerandoIA(true);
    setPropuestaIA(null);

    const respuesta = await fetch(`${API_URL}/api/ia/generar-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caloriasObjetivo: Number(calorias),
        dias: Number(diasIA),
        preferencias: preferenciasIA,
        restricciones: restriccionesIA,
        indicaciones: indicacionesIA,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.generado) {
      throw new Error(datos.mensaje || 'No se pudo generar el menú.');
    }

    setPropuestaIA(datos.propuesta);

    Alert.alert(
      '¡Menú generado!',
      'La propuesta está lista. Revisa los alimentos antes de incorporarlos al plan.'
    );
  } catch (error: any) {
    Alert.alert(
      'Error',
      error.message || 'Ocurrió un problema al generar el menú.'
    );
  } finally {
    setGenerandoIA(false);
  }
};
    const guardarPropuestaCompleta = async () => {
  if (!idPlan) {
    Alert.alert(
      'Plan no guardado',
      'Primero guarda la información general del plan.'
    );
    return;
  }

  if (!propuestaIA || propuestaIA.dias.length === 0) {
    Alert.alert('Sin propuesta', 'Primero genera un menú con IA.');
    return;
  }

  if (propuestaImportada || guardandoPropuestaIA) {
    return;
  }

  // Revisar que todos los ingredientes existan en el catálogo.
  const pendientes = propuestaIA.dias.flatMap(dia =>
    dia.comidas.flatMap(comida =>
      comida.ingredientes
        .filter(ingrediente => !ingrediente.id_alimento)
        .map(ingrediente => ingrediente.nombre)
    )
  );

  if (pendientes.length > 0) {
    Alert.alert(
      'Ingredientes pendientes',
      `Estos ingredientes necesitan revisión antes de guardar el menú:\n\n${[...new Set(pendientes)].join(', ')}`
    );
    return;
  }

  const totalComidas = propuestaIA.dias.reduce(
    (total, dia) => total + dia.comidas.length,
    0
  );

  Alert.alert(
    'Guardar menú completo',
    `Se agregarán ${totalComidas} comidas al plan alimenticio. ¿Deseas continuar?`,
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Guardar',
        onPress: async () => {
          try {
            setGuardandoPropuestaIA(true);

            let comidasGuardadas = 0;

            for (const dia of propuestaIA.dias) {
              for (const comida of dia.comidas) {
                const respuesta = await fetch(
                  `${API_URL}/api/planes/${idPlan}/comidas`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      nombre: comida.nombre,
                     tipo: (() => {
  const tipo = comida.tipo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (tipo.includes('desayuno')) return 'desayuno';
  if (tipo.includes('cena')) return 'cena';
  if (tipo.includes('colacion') || tipo.includes('snack')) return 'colacion';

  return 'comida';
})(),
                      dia_plan: dia.dia,
                      instrucciones: comida.instrucciones || null,
                      alimentos: comida.ingredientes.map(ingrediente => ({
                        id_alimento: ingrediente.id_alimento,
                        cantidad: ingrediente.cantidad,
                        unidad: ingrediente.unidad,
                      })),
                    }),
                  }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                  throw new Error(
                    datos.mensaje || `No se pudo guardar: ${comida.nombre}`
                  );
                }

                comidasGuardadas++;
              }
            }

            await actualizarListaComidas();

            setPropuestaImportada(true);

            Alert.alert(
              '¡Menú guardado!',
              `Se agregaron ${comidasGuardadas} comidas al plan. Ahora puedes revisar los días y publicar el menú.`
            );

          } catch (error) {
            console.error('Error al guardar propuesta:', error);

            Alert.alert(
              'Error al guardar',
              error instanceof Error
                ? error.message
                : 'No se pudo guardar el menú completo.'
            );
          } finally {
            setGuardandoPropuestaIA(false);
          }
        },
      },
    ]
  );
};
  const guardarPlan = async () => {
    if (idPlan || guardandoPlan) return;

    if (!nombrePlan.trim() || !fechaInicio.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Ingresa el nombre del plan y la fecha de inicio.'
      );
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
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el servidor.'
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

    if (comidasPlan.length === 0) {
      Alert.alert(
        'Menú vacío',
        'Agrega al menos una comida antes de publicar el plan.'
      );
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
                throw new Error(
                  datos.mensaje || 'No se pudo publicar el plan.'
                );
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
            {/* Generador de menús con Azure AI */}
      <View style={styles.card}>
        <Text style={styles.seccion}>✨ Generar menú con IA</Text>

        <Text style={styles.detalle}>
          Crea una propuesta de menú personalizada utilizando inteligencia artificial.
        </Text>

        <Text style={styles.label}>Número de días</Text>
        <View style={styles.diasContainer}>
          {['1', '2', '3', '4', '5'].map(dia => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.botonDia,
                diasIA === dia && styles.botonDiaSeleccionado,
              ]}
              onPress={() => setDiasIA(dia)}
            >
              <Text
                style={[
                  styles.textoDia,
                  diasIA === dia && styles.textoDiaSeleccionado,
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Preferencias alimenticias</Text>
        <TextInput
          style={[styles.input, styles.multilinea]}
          placeholder="Ej. Comidas variadas, económicas..."
          value={preferenciasIA}
          onChangeText={setPreferenciasIA}
          multiline
        />

        <Text style={styles.label}>Restricciones alimenticias</Text>
        <TextInput
          style={[styles.input, styles.multilinea]}
          placeholder="Ej. Sin lactosa, sin cacahuates..."
          value={restriccionesIA}
          onChangeText={setRestriccionesIA}
          multiline
        />

        <Text style={styles.label}>Indicaciones adicionales</Text>
        <TextInput
          style={[styles.input, styles.multilinea]}
          placeholder="Ej. Incluir pollo, pescado, verduras..."
          value={indicacionesIA}
          onChangeText={setIndicacionesIA}
          multiline
        />

        <TouchableOpacity
          style={[
            styles.boton,
            styles.botonInterno,
            generandoIA && { opacity: 0.6 },
          ]}
          onPress={generarMenuIA}
          disabled={generandoIA}
        >
          <Text style={styles.textoBoton}>
            {generandoIA ? 'Generando menú...' : '✨ Generar propuesta'}
          </Text>
        </TouchableOpacity>

        {propuestaIA && (
          <View style={{ marginTop: 22 }}>
            <Text style={styles.seccion}>Propuesta generada</Text>

            {propuestaIA.dias.map((dia, indice) => (
              <View key={indice} style={styles.grupoDia}>
                <Text style={styles.diaTitulo}>
                  {diasSemana[dia.dia - 1] || `Día ${dia.dia}`}
                </Text>

                {dia.comidas.map((comida, indiceComida) => (
                  <View
                    key={indiceComida}
                    style={{
                      backgroundColor: '#F8F8F8',
                      padding: 12,
                      borderRadius: 11,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.comidaNombre}>
                      {comida.nombre}
                    </Text>

                    <Text style={styles.comidaDetalle}>
                      {comida.tipo}
                    </Text>

                    {comida.ingredientes.map((ingrediente, index) => (
                      <Text key={index} style={styles.alimentoDetalle}>
                        • {ingrediente.nombre}: {ingrediente.cantidad}{' '}
                        {ingrediente.unidad}
                      </Text>
                    ))}

                    {comida.ingredientes.some(
                      ingrediente => !ingrediente.en_catalogo
                    ) && (
                      <Text
                        style={{
                          color: '#B7791F',
                          fontSize: 12,
                          marginTop: 8,
                          fontWeight: '600',
                        }}
                      >
                        Algunos ingredientes no están en el catálogo y requieren revisión.
                      </Text>
                    )}

                    {comida.instrucciones ? (
                      <Text style={styles.comidaDetalle}>
                        Preparación: {comida.instrucciones}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ))}

            {Array.isArray(propuestaIA.observaciones) ? (
  propuestaIA.observaciones.map((observacion, index) => (
    <Text key={index} style={styles.detalle}>
      • {observacion}
    </Text>
  ))
) : propuestaIA.observaciones ? (
  <Text style={styles.detalle}>
    {String(propuestaIA.observaciones)}
  </Text>
) : null}
                <TouchableOpacity
              style={[
                styles.boton,
                styles.botonInterno,
                {
                  backgroundColor: '#1F416A',
                  marginTop: 18,
                  opacity: guardandoPropuestaIA || propuestaImportada ? 0.6 : 1,
                },
              ]}
              onPress={guardarPropuestaCompleta}
              disabled={guardandoPropuestaIA || propuestaImportada}
            >
              <Text style={styles.textoBoton}>
                {guardandoPropuestaIA
                  ? 'Guardando menú completo...'
                  : propuestaImportada
                    ? '✓ Menú agregado al plan'
                    : 'Guardar menú completo en el plan'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
      {/* Lista de comidas que ya tiene el plan */}
      {idPlan !== null && (
        <View style={styles.card}>
          <Text style={styles.seccion}>Comidas del plan</Text>

          {cargandoComidas ? (
            <Text style={styles.detalle}>Actualizando comidas...</Text>
          ) : comidasPlan.length === 0 ? (
            <Text style={styles.detalle}>
              Todavía no hay comidas agregadas.
            </Text>
          ) : (
            diasSemana.map((dia, indice) => {
              const comidasDelDia = comidasPlan.filter(
                comida => comida.dia_plan === indice + 1
              );

              if (comidasDelDia.length === 0) return null;

              return (
                <View key={dia} style={styles.grupoDia}>
                  <Text style={styles.diaTitulo}>{dia}</Text>

                  {comidasDelDia.map(comida => (
                    <View key={comida.id_comida} style={styles.comidaExistente}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.comidaNombre}>
                          {comida.nombre}
                        </Text>

                        <Text style={styles.comidaDetalle}>
                          {comida.tipo.charAt(0).toUpperCase() +
                            comida.tipo.slice(1)}
                        </Text>

                        {comida.detalle_comidas?.map((detalle, index) => (
                          <Text key={index} style={styles.alimentoDetalle}>
                            • {detalle.alimento?.nombre || 'Alimento'}:{' '}
                            {detalle.cantidad} {detalle.unidad}
                          </Text>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={styles.botonEditar}
                        onPress={() => editarComida(comida)}
                      >
                        <Text style={styles.textoEditar}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.seccion}>
          {idComidaEditando !== null
            ? 'Editar comida'
            : 'Agregar comidas al menú'}
        </Text>

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
            style={[
              styles.opcion,
              tipoComida === tipo && styles.opcionSeleccionada,
            ]}
            onPress={() => setTipoComida(tipo)}
          >
            <Text style={styles.textoOpcion}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Día del plan</Text>

        <View style={styles.diasContainer}>
          {diasSemana.map((dia, indice) => (
            <TouchableOpacity
              key={dia}
              style={[
                styles.botonDia,
                diaPlan === String(indice + 1) &&
                  styles.botonDiaSeleccionado,
              ]}
              onPress={() => setDiaPlan(String(indice + 1))}
            >
              <Text
                style={[
                  styles.textoDia,
                  diaPlan === String(indice + 1) &&
                    styles.textoDiaSeleccionado,
                ]}
              >
                {dia.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Seleccionar alimento</Text>

        <View>
          {alimentosDisponibles.map(alimento => (
            <TouchableOpacity
              key={alimento.id_alimento}
              style={[
                styles.alimentoOpcion,
                alimentoSeleccionado === String(alimento.id_alimento) &&
                  styles.opcionSeleccionada,
              ]}
              onPress={() => {
                setAlimentoSeleccionado(String(alimento.id_alimento));
                setUnidad(alimento.unidad_base);
              }}
            >
              <Text style={styles.textoOpcion}>
                {alimento.nombre}{' '}
                {alimentoSeleccionado === String(alimento.id_alimento)
                  ? '✓'
                  : ''}
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
          style={[styles.boton, styles.botonInterno]}
          onPress={agregarAlimento}
        >
          <Text style={styles.textoBoton}>+ Agregar alimento</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Alimentos agregados</Text>

        {alimentosComida.map((alimento, index) => (
          <View key={`${alimento.id_alimento}-${index}`} style={styles.filaAlimento}>
            <Text style={styles.alimentoAgregado}>
              • {alimento.nombre}: {alimento.cantidad} {alimento.unidad}
            </Text>

            <TouchableOpacity onPress={() => quitarAlimento(index)}>
              <Text style={styles.quitarAlimento}>Quitar</Text>
            </TouchableOpacity>
          </View>
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
          style={[styles.boton, styles.botonInterno, { marginTop: 18 }]}
          onPress={guardarComida}
          disabled={guardandoComida}
        >
          <Text style={styles.textoBoton}>
            {guardandoComida
              ? 'Guardando...'
              : idComidaEditando !== null
                ? 'Guardar cambios'
                : 'Guardar comida en el plan'}
          </Text>
        </TouchableOpacity>

        {idComidaEditando !== null && (
          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={limpiarFormularioComida}
          >
            <Text style={styles.textoCancelar}>Cancelar edición</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.boton,
          (guardandoPlan || idPlan !== null) && { opacity: 0.6 },
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
            { backgroundColor: '#1F416A', marginTop: 15 },
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
  botonInterno: {
    marginHorizontal: 0,
    marginTop: 15,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opcion: {
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 7,
  },
  opcionSeleccionada: {
    backgroundColor: '#DCEAF5',
    borderColor: '#4089C0',
    borderWidth: 1,
  },
  textoOpcion: {
    color: '#1F416A',
  },
  diasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  botonDia: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
  },
  botonDiaSeleccionado: {
    backgroundColor: '#4089C0',
  },
  textoDia: {
    color: '#1F416A',
    fontWeight: '600',
  },
  textoDiaSeleccionado: {
    color: '#FFFFFF',
  },
  alimentoOpcion: {
    padding: 12,
    borderRadius: 9,
    marginBottom: 5,
    backgroundColor: '#F8F8F8',
  },
  filaAlimento: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  alimentoAgregado: {
    color: '#1F416A',
    flex: 1,
  },
  quitarAlimento: {
    color: '#C45B5B',
    fontWeight: '600',
    marginLeft: 10,
  },
  grupoDia: {
    marginBottom: 17,
  },
  diaTitulo: {
    color: '#4089C0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 9,
  },
  comidaExistente: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 11,
    marginBottom: 8,
    gap: 8,
  },
  comidaNombre: {
    color: '#1F416A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  comidaDetalle: {
    color: '#687586',
    marginTop: 3,
    fontSize: 12,
  },
  alimentoDetalle: {
    color: '#687586',
    fontSize: 12,
    marginTop: 3,
  },
  botonEditar: {
    backgroundColor: '#DCEAF5',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  textoEditar: {
    color: '#1F416A',
    fontWeight: 'bold',
  },
  botonCancelar: {
    padding: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  textoCancelar: {
    color: '#C45B5B',
    fontWeight: '600',
  },
});
