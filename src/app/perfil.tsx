import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function Perfil() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const datosGuardados = await AsyncStorage.getItem('usuario');

        if (datosGuardados) {
          setUsuario(JSON.parse(datosGuardados));
        }
      } catch (error) {
        console.error('Error al cargar los datos del usuario:', error);
      }
    };

    cargarUsuario();
  }, []);

  return (
    <View style={styles.container}>

      {/* Botón regresar */}
<TouchableOpacity
  style={styles.botonRegresar}
  onPress={() => router.replace('/menu')}
  activeOpacity={0.7}
>
  <Text style={styles.flechaRegresar}>‹</Text>
</TouchableOpacity>

      {/* Título */}
      <Text style={styles.titulo}>
        Mi <Text style={styles.troya}>perfil</Text>
      </Text>

      <Text style={styles.subtitulo}>
        Administra tu información y preferencias
      </Text>

      {/* Información del usuario */}
      <View style={styles.tarjetaPerfil}>

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>👤</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.nombre}>
  {usuario
    ? `${usuario.nombre} ${usuario.apellidos}`
    : 'Cargando...'}
</Text>

<Text style={styles.expediente}>
  Expediente: {usuario?.expediente || 'No registrado'}
</Text>

          <Text style={styles.universidad}>
            Facultad de Informática
          </Text>
        </View>

      </View>

      {/* Opciones */}
      <TouchableOpacity style={styles.opcion}>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>✏️</Text>
        </View>

        <View style={styles.textoOpcion}>
          <Text style={styles.tituloOpcion}>
            Editar información
          </Text>

          <Text style={styles.descripcionOpcion}>
            Actualiza tus datos personales
          </Text>
        </View>

        <Text style={styles.flecha}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcion}>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>🥗</Text>
        </View>

        <View style={styles.textoOpcion}>
          <Text style={styles.tituloOpcion}>
            Mis objetivos
          </Text>

          <Text style={styles.descripcionOpcion}>
            Consulta tus objetivos nutricionales
          </Text>
        </View>

        <Text style={styles.flecha}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcion}>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>🔔</Text>
        </View>

        <View style={styles.textoOpcion}>
          <Text style={styles.tituloOpcion}>
            Notificaciones
          </Text>

          <Text style={styles.descripcionOpcion}>
            Administra tus recordatorios
          </Text>
        </View>

        <Text style={styles.flecha}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcion}>
        <View style={styles.icono}>
          <Text style={styles.iconoTexto}>⚙️</Text>
        </View>

        <View style={styles.textoOpcion}>
          <Text style={styles.tituloOpcion}>
            Configuración
          </Text>

          <Text style={styles.descripcionOpcion}>
            Personaliza tu experiencia
          </Text>
        </View>

        <Text style={styles.flecha}>›</Text>
      </TouchableOpacity>

      

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f4e5c9',
    paddingHorizontal: 25,
    paddingTop: 55,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '500',
    color: '#252525',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 8,
  },

  troya: {
    fontWeight: '800',
    color: '#1F416A',
  },

  subtitulo: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 22,
  },

  tarjetaPerfil: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.10,
    shadowRadius: 8,

    elevation: 4,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#dcecf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  avatarTexto: {
    fontSize: 32,
  },

  info: {
    flex: 1,
  },

  nombre: {
    fontSize: 17,
    fontWeight: '800',
    color: '#292929',
    marginBottom: 5,
  },

  expediente: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 3,
  },

  universidad: {
    fontSize: 12,
    color: '#777777',
  },

  opcion: {
    width: '100%',
    minHeight: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  icono: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#dcecf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  iconoTexto: {
    fontSize: 23,
  },

  textoOpcion: {
    flex: 1,
  },

  tituloOpcion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#292929',
    marginBottom: 4,
  },

  descripcionOpcion: {
    fontSize: 11,
    color: '#777777',
  },

  flecha: {
    fontSize: 29,
    color: '#4D91C7',
    marginLeft: 8,
  },
  botonRegresar: {
  width: 40,
  height: 40,
  borderRadius: 14,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 3,
},

flechaRegresar: {
  fontSize: 32,
  color: '#4089C0',
  lineHeight: 35,
  marginTop: -4,
},


});

