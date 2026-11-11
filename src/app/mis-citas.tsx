
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const API_URL = 'https://troyafit-api.onrender.com';
const ID_NUTRIOLOGA = 2;

export default function MisCitas() {
  const [citas, setCitas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
const programarRecordatorioCita = async (cita: any) => {
  try {
    const permiso = await Notifications.getPermissionsAsync();

    console.log('PERMISO DE NOTIFICACIONES:', permiso.status);
    console.log('CITA RECIBIDA:', cita.id_cita, cita.estado);

    if (permiso.status !== 'granted') {
      const solicitado = await Notifications.requestPermissionsAsync();

      if (solicitado.status !== 'granted') {
        console.log('No se concedieron permisos de notificaciones');
        return;
      }
    }

    const claveConfirmacion = `confirmacion_cita_v2_${cita.id_cita}`;
    const claveRecordatorio = `recordatorio_cita_${cita.id_cita}`;

    // 1. Notificación cuando la cita está confirmada
    const confirmacionEnviada = await AsyncStorage.getItem(claveConfirmacion);

    if (!confirmacionEnviada) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ ¡Tu cita fue confirmada!',
          body: `Tu consulta será el ${cita.fecha} a las ${cita.hora}.`,
        },
        trigger: null,
      });

      console.log('NOTIFICACIÓN DE CONFIRMACIÓN PROGRAMADA');

      await AsyncStorage.setItem(claveConfirmacion, 'true');
    }

    // 2. Recordatorio dos horas antes de la cita
    const yaProgramado = await AsyncStorage.getItem(claveRecordatorio);

    if (!yaProgramado) {
      const [anio, mes, dia] = cita.fecha.split('-').map(Number);
      const [hora, minutos] = cita.hora.split(':').map(Number);

      const fechaCita = new Date(anio, mes - 1, dia, hora, minutos);

      const fechaRecordatorio = new Date(
        fechaCita.getTime() - 2 * 60 * 60 * 1000
      );

      if (fechaRecordatorio > new Date()) {
        const identificador =
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '📅 ¡Recuerda tu cita!',
              body: `Hoy tienes una consulta nutricional a las ${cita.hora}.`,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: fechaRecordatorio,
            },
          });

        console.log('RECORDATORIO DE CITA PROGRAMADO:', identificador);

        await AsyncStorage.setItem(claveRecordatorio, identificador);
      }
    }
  } catch (error) {
    console.log('Error al programar notificación de cita:', error);
  }
};

  const cargarCitas = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');

      if (!usuarioGuardado) {
        Alert.alert('Atención', 'No se encontró tu sesión.');
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);

      const respuesta = await fetch(
        `${API_URL}/api/citas/${ID_NUTRIOLOGA}`
      );

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar las citas.');
      }

      const todasLasCitas = await respuesta.json();

      const misCitas = todasLasCitas.filter(
        (cita: any) =>
          Number(cita.id_estudiante) === Number(usuario.id_usuario)
      );

     setCitas(misCitas);

for (const cita of misCitas) {
  if (cita.estado === 'confirmada') {
    await programarRecordatorioCita(cita);
  }
}
    } catch (error) {
      console.log('Error al cargar citas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus citas.');
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarCitas();
    }, [])
  );
  const cancelarCita = (idCita: number) => {
    Alert.alert(
      'Cancelar cita',
      '¿Estás segura de que deseas cancelar esta cita?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const usuarioGuardado = await AsyncStorage.getItem('usuario');

              if (!usuarioGuardado) {
                Alert.alert('Error', 'No se encontró tu sesión.');
                return;
              }

              const usuario = JSON.parse(usuarioGuardado);

              const respuesta = await fetch(
                `${API_URL}/api/citas/estudiante/${usuario.id_usuario}/${idCita}/cancelar`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              const datos = await respuesta.json();

              if (!respuesta.ok) {
                throw new Error(datos.mensaje || 'No se pudo cancelar la cita.');
              }

              Alert.alert('¡Listo!', datos.mensaje);
              cargarCitas();

            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo cancelar la cita.');
            }
          },
        },
      ]
    );
  };
  const confirmarAsistencia = (idCita: number, asistira: boolean) => {
  Alert.alert(
    asistira ? 'Confirmar asistencia' : 'Cancelar asistencia',
    asistira
      ? '¿Confirmas que asistirás a tu cita?'
      : '¿Seguro que no podrás asistir? El horario quedará disponible para otro alumno.',
    [
      {
        text: 'Regresar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {
            const usuarioGuardado = await AsyncStorage.getItem('usuario');

            if (!usuarioGuardado) {
              Alert.alert('Error', 'No se encontró tu sesión.');
              return;
            }

            const usuario = JSON.parse(usuarioGuardado);

            const respuesta = await fetch(
              `${API_URL}/api/citas/estudiante/${usuario.id_usuario}/${idCita}/asistencia`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asistira }),
              }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
              throw new Error(datos.mensaje || 'No se pudo registrar tu respuesta.');
            }

            Alert.alert('¡Listo!', datos.mensaje);
            cargarCitas();

          } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo registrar tu respuesta.');
          }
        },
      },
    ]
  );
};
  const obtenerEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return { texto: 'Confirmada', color: '#DDF2E3', textoColor: '#27834A' };
      case 'cancelada':
        return { texto: 'Cancelada', color: '#FBE1E1', textoColor: '#B83232' };
      case 'pendiente':
        return { texto: 'Pendiente', color: '#FFF0CF', textoColor: '#A87916' };
      default:
        return { texto: estado, color: '#EAEAEA', textoColor: '#666666' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonRegresar}
            onPress={() => router.back()}
          >
            <Text style={styles.flecha}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Mis citas</Text>

          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitulo}>
          Consulta el estado de tus citas con la nutrióloga.
        </Text>

        {cargando ? (
          <ActivityIndicator size="large" color="#4089C0" />
        ) : citas.length === 0 ? (
          <View style={styles.tarjetaVacia}>
            <Text style={styles.iconoVacio}>📅</Text>
            <Text style={styles.textoVacio}>
              Aún no tienes citas registradas.
            </Text>
    
          </View>
        ) : (
          citas.map((cita) => {
            const estado = obtenerEstado(cita.estado);

            return (
              <View key={cita.id_cita} style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>
                  Consulta nutricional
                </Text>

                <View style={styles.dato}>
                  <Text style={styles.icono}>📅</Text>
                  <Text style={styles.valor}>{cita.fecha}</Text>
                </View>

                <View style={styles.dato}>
                  <Text style={styles.icono}>🕐</Text>
                  <Text style={styles.valor}>{cita.hora}</Text>
                </View>

                <View style={styles.estadoContenedor}>
                  <Text style={styles.etiquetaEstado}>Estado:</Text>
                  <View style={[styles.badge, { backgroundColor: estado.color }]}>
                    <Text style={{ color: estado.textoColor, fontWeight: '700' }}>
                      {estado.texto}
                    </Text>
                  </View>
                </View>
                  {cita.estado === 'confirmada' &&
 cita.confirmacion_asistencia === null && (
  <View style={styles.asistenciaContenedor}>
    <Text style={styles.textoPregunta}>
      ¿Asistirás a tu cita?
    </Text>

    <TouchableOpacity
      style={styles.botonAsistire}
      onPress={() => confirmarAsistencia(cita.id_cita, true)}
    >
      <Text style={styles.textoAsistire}>
        Sí, asistiré
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.botonNoAsistire}
      onPress={() => confirmarAsistencia(cita.id_cita, false)}
    >
      <Text style={styles.textoNoAsistire}>
        No podré asistir
      </Text>
    </TouchableOpacity>
  </View>
)}

{['pendiente', 'confirmada'].includes(cita.estado) &&
 cita.confirmacion_asistencia !== true && (
  <TouchableOpacity
    style={styles.botonCancelar}
    onPress={() => cancelarCita(cita.id_cita)}
  >
    <Text style={styles.textoCancelar}>
      Cancelar cita
    </Text>
  </TouchableOpacity>
)}

{cita.confirmacion_asistencia === true && (
  <Text style={styles.asistenciaConfirmada}>
    ✓ Ya confirmaste tu asistencia
  </Text>
)}
              </View>
              
            );
          })
        )}
                   {!cargando && (
          <TouchableOpacity
            style={styles.botonAgendar}
            onPress={() => router.push('/cita')}
          >
            <Text style={styles.textoBoton}>📅 Agendar nueva cita</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 30,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  botonRegresar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flecha: {
    fontSize: 30,
    color: '#4089C0',
    marginTop: -3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },
  tituloTarjeta: {
    fontSize: 16,
    color: '#1F416A',
    fontWeight: '800',
    marginBottom: 15,
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    fontSize: 19,
    marginRight: 12,
  },
  valor: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '600',
  },
  estadoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  etiquetaEstado: {
    color: '#666666',
    fontSize: 13,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tarjetaVacia: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
  },
  iconoVacio: {
    fontSize: 40,
    marginBottom: 12,
  },
  textoVacio: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 18,
  },
  botonAgendar: {
    backgroundColor: '#4089C0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
    botonCancelar: {
    backgroundColor: '#FBE1E1',
    paddingVertical: 11,
    borderRadius: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  textoCancelar: {
    color: '#B83232',
    fontWeight: '700',
    fontSize: 13,
  },
    asistenciaContenedor: {
    backgroundColor: '#F1F7FC',
    borderRadius: 16,
    padding: 13,
    marginTop: 15,
  },
  textoPregunta: {
    color: '#1F416A',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  botonAsistire: {
    backgroundColor: '#DDF2E3',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  textoAsistire: {
    color: '#27834A',
    fontWeight: '700',
  },
  botonNoAsistire: {
    backgroundColor: '#FBE1E1',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoNoAsistire: {
    color: '#B83232',
    fontWeight: '700',
  },
  asistenciaConfirmada: {
    color: '#27834A',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 15,
  },
});
