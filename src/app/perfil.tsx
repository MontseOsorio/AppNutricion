import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function Perfil() {
  return (
    <View style={styles.container}>

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
            Montserrat Osorio
          </Text>

          <Text style={styles.expediente}>
            Expediente: 327927
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

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.textoBoton}>
          Cerrar sesión
        </Text>
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

  boton: {
    width: '100%',
    backgroundColor: '#4089C0',
    paddingVertical: 15,
    borderRadius: 28,
    marginTop: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 4,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

});

