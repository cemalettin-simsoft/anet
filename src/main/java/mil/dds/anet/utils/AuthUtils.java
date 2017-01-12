package mil.dds.anet.utils;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;

import mil.dds.anet.beans.Organization;
import mil.dds.anet.beans.Person;
import mil.dds.anet.beans.Position;
import mil.dds.anet.beans.Position.PositionType;

public class AuthUtils {

	public static String UNAUTH_MESSAGE = "You do not have permissions to do this";
	
	public static void assertAdministrator(Person user) { 
		if (user.loadPosition() != null &&
				user.getPosition().getType() == PositionType.ADMINISTRATOR) { 
			return;
		}
		throw new WebApplicationException(UNAUTH_MESSAGE, Status.UNAUTHORIZED);
	}
	
	public static boolean isSuperUserForOrg(Person user, Organization org) { 
		Position position = user.loadPosition();
		if (position != null && 
				position.getType() == PositionType.SUPER_USER &&
				position.getOrganization() != null && 
				position.getOrganization().getId().equals(org.getId())) { 
			return true;
		} else if (position != null && 
				position.getType() == PositionType.ADMINISTRATOR) { 
			return true;
		}
		return false;
	}
	
	public static void assertSuperUserForOrg(Person user, Organization org) {
		if (isSuperUserForOrg(user, org)) { return; } 
		throw new WebApplicationException(UNAUTH_MESSAGE, Status.UNAUTHORIZED);
	}

	public static void assertSuperUser(Person user) {
		Position position = user.loadPosition();
		if (position != null && 
			(position.getType() == PositionType.SUPER_USER ||
			position.getType() == PositionType.ADMINISTRATOR)) { 
			return;
		}
		throw new WebApplicationException(UNAUTH_MESSAGE, Status.UNAUTHORIZED);
	}

	public static boolean isAdmin(Person user) {
		Position position = user.loadPosition();
		return position.getType() == PositionType.ADMINISTRATOR;
	}
	
}
